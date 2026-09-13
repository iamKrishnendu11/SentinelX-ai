use std::process::{Command, Child};
use std::sync::Mutex;
use tauri::{Manager, RunEvent};

struct SidecarProcesses {
    python_process: Option<Child>,
    java_process: Option<Child>,
}

pub fn run() {
    let sidecars = Mutex::new(SidecarProcesses {
        python_process: None,
        java_process: None,
    });

    tauri::Builder::default()
        .setup(|app| {
            println!("Initializing SentinelX Desktop Shell & Embedded Sidecar Services...");

            // 1. Resolve executable sidecar paths
            let app_dir = app.path().app_data_dir().unwrap_or_default();
            println!("SentinelX App Data Directory: {:?}", app_dir);

            // 2. Auto-launch embedded Python FastAPI sidecar if binary present
            let py_sidecar_path = std::env::current_exe()
                .ok()
                .and_then(|p| p.parent().map(|dir| dir.join("sentinelx-python-engine.exe")));

            if let Some(py_path) = py_sidecar_path {
                if py_path.exists() {
                    println!("Launching Embedded Python Backend: {:?}", py_path);
                    let child = Command::new(&py_path)
                        .spawn()
                        .ok();
                    if let Ok(mut state) = sidecars.lock() {
                        state.python_process = child;
                    }
                }
            }

            // 3. Auto-launch embedded Java Spring Boot sidecar if binary present
            let java_sidecar_path = std::env::current_exe()
                .ok()
                .and_then(|p| p.parent().map(|dir| dir.join("sentinelx-java-engine.exe")));

            if let Some(j_path) = java_sidecar_path {
                if j_path.exists() {
                    println!("Launching Embedded Java Backend: {:?}", j_path);
                    let child = Command::new(&j_path)
                        .spawn()
                        .ok();
                    if let Ok(mut state) = sidecars.lock() {
                        state.java_process = child;
                    }
                }
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(move |_app_handle, event| match event {
            RunEvent::ExitRequested { .. } => {
                println!("SentinelX Desktop shutting down. Terminating background sidecars...");
                if let Ok(mut state) = sidecars.lock() {
                    if let Some(ref mut py) = state.python_process {
                        let _ = py.kill();
                    }
                    if let Some(ref mut j) = state.java_process {
                        let _ = j.kill();
                    }
                }
            }
            _ => {}
        });
}
