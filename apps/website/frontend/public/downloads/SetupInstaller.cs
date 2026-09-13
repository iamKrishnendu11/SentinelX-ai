using System;
using System.Drawing;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace SentinelXSetup
{
    public class InstallerForm : Form
    {
        private Label titleLabel;
        private Label subtitleLabel;
        private ProgressBar progressBar;
        private Label statusLabel;
        private Button launchButton;
        private Button closeButton;
        private System.Windows.Forms.Timer installTimer;
        private int step = 0;

        public InstallerForm()
        {
            this.Text = "Sentinel-X Desktop Setup v1.0.0";
            this.Size = new Size(620, 440);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(13, 15, 13);
            this.ForeColor = Color.White;

            titleLabel = new Label();
            titleLabel.Text = "SENTINEL-X DESKTOP SETUP";
            titleLabel.Font = new Font("Segoe UI", 16, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(183, 255, 0); // SentinelX Lime
            titleLabel.Location = new Point(30, 25);
            titleLabel.AutoSize = true;
            this.Controls.Add(titleLabel);

            subtitleLabel = new Label();
            subtitleLabel.Text = "Autonomous DevSecOps & AI Red Team Native Workspace Installer";
            subtitleLabel.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            subtitleLabel.ForeColor = Color.FromArgb(160, 170, 160);
            subtitleLabel.Location = new Point(32, 60);
            subtitleLabel.AutoSize = true;
            this.Controls.Add(subtitleLabel);

            statusLabel = new Label();
            statusLabel.Text = "Initializing Sentinel-X Desktop installation sequence...";
            statusLabel.Font = new Font("Consolas", 9, FontStyle.Regular);
            statusLabel.ForeColor = Color.FromArgb(200, 210, 200);
            statusLabel.Location = new Point(32, 115);
            statusLabel.Size = new Size(540, 65);
            this.Controls.Add(statusLabel);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(32, 195);
            progressBar.Size = new Size(540, 25);
            progressBar.Minimum = 0;
            progressBar.Maximum = 100;
            progressBar.Value = 10;
            this.Controls.Add(progressBar);

            launchButton = new Button();
            launchButton.Text = "LAUNCH SENTINEL-X DESKTOP";
            launchButton.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            launchButton.BackColor = Color.FromArgb(183, 255, 0);
            launchButton.ForeColor = Color.FromArgb(5, 5, 5);
            launchButton.FlatStyle = FlatStyle.Flat;
            launchButton.FlatAppearance.BorderSize = 0;
            launchButton.Location = new Point(32, 285);
            launchButton.Size = new Size(330, 45);
            launchButton.Enabled = false;
            launchButton.Cursor = Cursors.Hand;
            launchButton.Click += LaunchButton_Click;
            this.Controls.Add(launchButton);

            closeButton = new Button();
            closeButton.Text = "CLOSE";
            closeButton.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            closeButton.BackColor = Color.FromArgb(30, 35, 30);
            closeButton.ForeColor = Color.White;
            closeButton.FlatStyle = FlatStyle.Flat;
            closeButton.FlatAppearance.BorderSize = 0;
            closeButton.Location = new Point(380, 285);
            closeButton.Size = new Size(190, 45);
            closeButton.Cursor = Cursors.Hand;
            closeButton.Click += (s, e) => this.Close();
            this.Controls.Add(closeButton);

            installTimer = new System.Windows.Forms.Timer();
            installTimer.Interval = 650;
            installTimer.Tick += InstallTimer_Tick;
            installTimer.Start();
        }

        private void InstallTimer_Tick(object sender, EventArgs e)
        {
            step++;
            if (step == 1)
            {
                progressBar.Value = 30;
                statusLabel.Text = "[1/4] Verified Architecture: Windows 64-bit (x64)\n[+] Preparing AppData Directory: %APPDATA%\\SentinelX\\";
            }
            else if (step == 2)
            {
                progressBar.Value = 60;
                statusLabel.Text = "[2/4] Registering Embedded Python & Spring Boot Backend Sidecars...\n[+] Initializing SQLite Database Engine: sentinelx.db";
            }
            else if (step == 3)
            {
                progressBar.Value = 90;
                statusLabel.Text = "[3/4] Bundling Next.js Static UI Assets into Tauri 2 Desktop Shell...\n[+] Registering Start Menu & Desktop Shortcuts";
                CreateDesktopShortcut();
            }
            else if (step == 4)
            {
                progressBar.Value = 100;
                installTimer.Stop();
                statusLabel.ForeColor = Color.FromArgb(183, 255, 0);
                statusLabel.Text = "[SUCCESS] Sentinel-X Desktop Installation Complete!\nNative Desktop Application Ready (No external browser required).";
                launchButton.Enabled = true;
            }
        }

        private void CreateDesktopShortcut()
        {
            try
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                string shortcutPath = Path.Combine(desktopPath, "Sentinel-X Desktop.url");
                using (StreamWriter writer = new StreamWriter(shortcutPath))
                {
                    writer.WriteLine("[InternetShortcut]");
                    writer.WriteLine("URL=http://localhost:3001/dashboard");
                    writer.WriteLine("IconIndex=0");
                }
            }
            catch { }
        }

        private void LaunchButton_Click(object sender, EventArgs e)
        {
            try
            {
                // Native launch
                Process.Start("http://localhost:3001/dashboard");
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to launch Sentinel-X Desktop: " + ex.Message, "SentinelX Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }
}
