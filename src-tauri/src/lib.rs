// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;

#[tauri::command]
fn get_current_branch(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .arg("branch")
        .arg("--show-current")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn get_branches(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .arg("branch")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn get_commit_log(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .args(["log", "--pretty=format:%h|%s|%an|%ad", "--date=short", "-n", "50"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn get_commit_stats_log(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .args(["log", "--numstat", "--format=COMMIT|%h|%an|%ar|%s", "-n", "20"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn get_status(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .args(["status", "--short"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn git_stash_save(repo_path: &str, message: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["stash", "save", message]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_stash_pop(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["stash", "pop"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_stash_list(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["stash", "list"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn get_graph_log(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(repo_path)
        .args(["log", "--all", "--date-order", "--pretty=format:%h|%p|%d|%s|%an|%ad", "--date=short", "-n", "100"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn get_diff(repo_path: &str, staged: bool, file_path: Option<String>) -> Result<String, String> {
    let mut args = vec!["diff".to_string()];
    if staged { args.push("--cached".to_string()); }
    if let Some(file) = file_path {
        args.push("--".to_string());
        args.push(file);
    }
    
    let output = Command::new("git").current_dir(repo_path).args(&args).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_add(repo_path: &str, files: Vec<String>) -> Result<String, String> {
    let mut args = vec!["add"];
    let files_ref: Vec<&str> = files.iter().map(AsRef::as_ref).collect();
    args.extend(files_ref);
    let output = Command::new("git").current_dir(repo_path).args(&args).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_commit(repo_path: &str, message: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["commit", "-m", message]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_rebase(repo_path: &str, target: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["rebase", target]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_pull(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["pull"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_push(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["push"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_init(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["init"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_clone(repo_url: &str, target_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(target_path).args(["clone", repo_url, "."]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_checkout(repo_path: &str, branch: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["checkout", branch]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_checkout_new_branch(repo_path: &str, branch: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["checkout", "-b", branch]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_merge(repo_path: &str, branch: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["merge", branch]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_delete_branch(repo_path: &str, branch: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["branch", "-D", branch]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_fetch(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["fetch", "--all"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_commit_amend(repo_path: &str, message: Option<String>) -> Result<String, String> {
    let mut args = vec!["commit".to_string(), "--amend".to_string()];
    if let Some(msg) = message {
        args.push("-m".to_string());
        args.push(msg);
    } else {
        args.push("--no-edit".to_string());
    }
    let output = Command::new("git").current_dir(repo_path).args(&args).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_restore_staged(repo_path: &str, file: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["restore", "--staged", file]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_discard_changes(repo_path: &str, file: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["restore", file]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_clean(repo_path: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["clean", "-fd"]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_config_get(repo_path: &str, key: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["config", key]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).trim().to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_config_set(repo_path: &str, key: &str, value: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["config", key, value]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_reset(repo_path: &str, mode: &str, commit: &str) -> Result<String, String> {
    let valid_modes = ["--soft", "--mixed", "--hard"];
    if !valid_modes.contains(&mode) {
        return Err("Invalid reset mode. Use --soft, --mixed, or --hard".to_string());
    }
    let output = Command::new("git").current_dir(repo_path).args(["reset", mode, commit]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_revert(repo_path: &str, commit: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["revert", "--no-edit", commit]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[tauri::command]
fn git_cherry_pick(repo_path: &str, commit: &str) -> Result<String, String> {
    let output = Command::new("git").current_dir(repo_path).args(["cherry-pick", commit]).output().map_err(|e| e.to_string())?;
    if output.status.success() { Ok(String::from_utf8_lossy(&output.stdout).to_string()) } else { Err(String::from_utf8_lossy(&output.stderr).to_string()) }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_branches,
            get_commit_log,
            get_graph_log,
            get_status,
            git_stash_save,
            git_stash_pop,
            git_stash_list,
            get_diff,
            git_add,
            git_commit,
            git_rebase,
            git_pull,
            git_push,
            git_init,
            git_clone,
            git_checkout,
            git_checkout_new_branch,
            git_merge,
            git_delete_branch,
            git_fetch,
            git_commit_amend,
            git_restore_staged,
            git_discard_changes,
            git_clean,
            git_config_get,
            git_config_set,
            git_reset,
            git_revert,
            git_cherry_pick,
            get_current_branch,
            get_commit_stats_log
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
