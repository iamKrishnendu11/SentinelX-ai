import os
import sys
import subprocess

def build_standalone_python_engine():
    """
    Compiles the Python FastAPI backend into a single standalone binary using PyInstaller.
    """
    print("==================================================")
    print(" Building SentinelX Standalone Python Engine Binary")
    print("==================================================")

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    main_py = os.path.join(backend_dir, "main.py")
    output_dir = os.path.join(backend_dir, "dist")

    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--onedir",
        "--name=sentinelx-python-engine",
        "--clean",
        f"--add-data={os.path.join(backend_dir, 'routers')};routers",
        f"--add-data={os.path.join(backend_dir, 'schemas')};schemas",
        f"--add-data={os.path.join(backend_dir, 'services')};services",
        main_py
    ]

    print("Running command:", " ".join(cmd))
    try:
        res = subprocess.run(cmd, cwd=backend_dir)
        if res.returncode == 0:
            print("Successfully built standalone Python engine in:", output_dir)
        else:
            print("PyInstaller exited with code:", res.returncode)
    except Exception as e:
        print("Failed building Python standalone sidecar:", e)

if __name__ == "__main__":
    build_standalone_python_engine()
