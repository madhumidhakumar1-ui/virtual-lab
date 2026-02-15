const THEME_KEY = "vlab-theme";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page || "";

    applyStoredTheme();
    attachThemeToggle();

    switch (page) {
        case "dashboard":
            initDashboard();
            break;
        case "lab":
            initLab();
            setupLinuxLab();
            setupPythonLab();
            setupWebLab();
            break;
        default:
            break;
    }
});

/* ------------------ THEME ------------------ */

function applyStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function attachThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem(THEME_KEY, theme);
        toggle.textContent = theme === "dark" ? "☀️" : "🌙";
    });

    toggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

/* ------------------ DASHBOARD ------------------ */

function initDashboard() {
    highlightNavButton("dashboard");

    const greeting = document.getElementById("dashboard-greeting");
    if (greeting) {
        greeting.textContent = "Welcome to Virtual Lab!";
    }

    const launchButtons = document.querySelectorAll(".launch-btn");
    const navButtons = document.querySelectorAll(".sidebar-nav .nav-btn[data-nav]");

    launchButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const lab = button.dataset.lab;
            if (lab) {
                setActivePanel(lab);
            }
        });
    });

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const lab = button.dataset.nav;
            if (lab) {
                setActivePanel(lab);
            }
        });
    });
}

/* ------------------ LAB CONTENT ------------------ */

const labContent = {
    linux: {
        title: "Linux Terminal Lab",
        description: "Execute familiar shell commands in a safe sandbox.",
        experiments: [
            "File and Directory Manipulation",
            "Text Processing with Grep and Sed",
            "User and Group Management",
            "Process Monitoring and Control",
            "Shell Scripting Basics"
        ]
    },
    python: {
        title: "Python Lab",
        description: "Practice Python snippets and view output instantly.",
        experiments: [
            "Data Types and Variables",
            "Conditional Statements and Loops",
            "Functions and Modules",
            "List Comprehensions",
            "File Handling Basics"
        ]
    },
    web: {
        title: "Web Development Lab",
        description: "Prototype HTML layouts with live preview.",
        experiments: [
            "HTML Structure",
            "CSS Styling",
            "Flexbox & Grid",
            "JavaScript DOM",
            "Event Handling"
        ]
    }
};

function initLab() {
    for (const lab in labContent) {
        const header = document.getElementById(`${lab}-workspace-header`);
        if (header) {
            const experimentsHtml = labContent[lab].experiments
                .map(exp => `<li>${exp}</li>`)
                .join('');
            header.innerHTML = `
                <h2>${labContent[lab].title}</h2>
                <p>${labContent[lab].description}</p>
                <h3>Experiments:</h3>
                <ul>${experimentsHtml}</ul>
            `;
        }
    }
}

/* ------------------ PANEL SWITCH ------------------ */

function setActivePanel(panelId) {
    document.querySelectorAll('.panel-content > div').forEach(panel => {
        panel.classList.add('hidden');
    });

    const activePanel = document.getElementById(`${panelId}-panel`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }

    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        btn.classList.remove('is-active');
    });

    const activeButton = document.querySelector(
        `.sidebar-nav .nav-btn[data-nav="${panelId}"]`
    );

    if (activeButton) {
        activeButton.classList.add('is-active');
    }

    updateExperiments(panelId);
}

function updateExperiments(labId) {
    const container = document.getElementById('experiments-container');
    const lab = labContent[labId];

    if (lab && lab.experiments && container) {
        const experimentsHtml = lab.experiments
            .map(exp => `<li>${exp}</li>`)
            .join('');
        container.innerHTML = `<h3>Experiments</h3><ul>${experimentsHtml}</ul>`;
    }
}

/* ------------------ LINUX LAB ------------------ */

function setupLinuxLab() {
    const input = document.getElementById("linux-command");
    const runBtn = document.getElementById("linux-run");
    const output = document.getElementById("linux-output");

    if (!input || !runBtn || !output) return;

    const execute = () => {
        const command = input.value.trim().toLowerCase();
        if (!command) return;

        output.textContent += `\n> ${command}\n`;

        switch (command) {
            case "ls":
                output.textContent += "documents.txt\nproject\nscripts\nREADME.md\n";
                break;
            case "pwd":
                output.textContent += "/home/student\n";
                break;
            case "clear":
                output.textContent = "";
                break;
            default:
                output.textContent += `Command not found: ${command}\n`;
        }

        input.value = "";
        output.scrollTop = output.scrollHeight;
    };

    runBtn.addEventListener("click", execute);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            execute();
        }
    });
}

/* ------------------ PYTHON LAB ------------------ */

function setupPythonLab() {
    const textarea = document.getElementById("python-code");
    const output = document.getElementById("python-output");
    const runBtn = document.getElementById("python-run");

    if (!textarea || !output || !runBtn) return;

    runBtn.addEventListener("click", () => {
        const code = textarea.value.trim();

        if (!code) {
            output.textContent = "(no output)";
            return;
        }

        if (/^[0-9+\-*/%.()\s]+$/.test(code)) {
            try {
                const result = Function(`"use strict"; return (${code});`)();
                output.textContent = result;
            } catch {
                output.textContent = "Invalid expression";
            }
        } else if (code.startsWith("print(")) {
            output.textContent = code
                .replace("print(", "")
                .replace(")", "")
                .replace(/['"]/g, "");
        } else {
            output.textContent = "Unsupported statement";
        }
    });
}

/* ------------------ WEB LAB ------------------ */

function setupWebLab() {
    const textarea = document.getElementById("web-html");
    const runBtn = document.getElementById("web-run");
    const preview = document.getElementById("web-preview");

    if (!textarea || !runBtn || !preview) return;

    runBtn.addEventListener("click", () => {
        preview.srcdoc = textarea.value;
    });

    preview.srcdoc = textarea.value;
}
