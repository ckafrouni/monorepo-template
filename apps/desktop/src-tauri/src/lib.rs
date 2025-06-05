use std::sync::Mutex;
use tauri::{Emitter, Manager, State};
use tauri_plugin_deep_link::DeepLinkExt;

// Store the initial launch URL
#[derive(Default)]
struct InitialUrl(Mutex<Option<String>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
// Command called by frontend to request any pending initial URL
#[tauri::command]
fn request_initial_url(app_handle: tauri::AppHandle, initial_url_state: State<InitialUrl>) {
    println!("🔗 Frontend requested initial URL");

    // Check if we have an initial URL and emit it as a deep-link event
    let mut url = initial_url_state.0.lock().unwrap();
    if let Some(initial_url) = url.take() {
        println!("📤 Sending initial URL to frontend: {}", initial_url);
        drop(url);

        // Emit the initial URL using the same system as subsequent deep links
        if let Some(webview_window) = app_handle.get_webview_window("main") {
            match webview_window.emit("deep-link", &initial_url) {
                Ok(_) => println!("✅ Initial URL emitted successfully"),
                Err(e) => println!("❌ Failed to emit initial URL: {}", e),
            }
        } else {
            println!("❌ Could not find main webview window");
        }
    } else {
        println!("ℹ️ No initial URL stored");
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .manage(InitialUrl::default())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Register deep links at runtime for development and Linux/Windows
            #[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
            {
                app.deep_link().register_all()?;
            }

            // Capture the app handle for use in the closure
            let app_handle = app.handle().clone();

            // Store any initial launch URL in app state
            match app.deep_link().get_current() {
                Ok(Some(initial_urls)) if !initial_urls.is_empty() => {
                    if let Some(url) = initial_urls.first() {
                        let initial_url_state: State<InitialUrl> = app.state();
                        let mut stored_url = initial_url_state.0.lock().unwrap();
                        *stored_url = Some(url.as_str().to_string());
                    }
                }
                Ok(Some(_)) => {}
                Ok(None) => {}
                Err(_) => {}
            }

            // Handle subsequent deep link URLs (when app is already running)
            app.deep_link().on_open_url(move |event| {
                let urls = event.urls();

                // Send the deep link event to the frontend
                if let Some(url) = urls.first() {
                    // Get the app handle and emit the deep link event
                    if let Some(webview_window) = app_handle.get_webview_window("main") {
                        let _ = webview_window.emit("deep-link", url.as_str());
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![request_initial_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
