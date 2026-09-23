/**
 * Human labels for every tool the agent can call.
 *
 * Single source of truth on purpose. This map used to be copy-pasted into
 * AvatarInterface.jsx and ToolExecutionCard.jsx with *different* wording for
 * the same tool ("Web Search" vs "Searching the web"), and neither copy
 * covered all of the backend's tools — so navigate, read_file, write_file,
 * get_training_history, trigger_background_task and call_mcp_tool fell
 * through to their raw function names in the UI.
 *
 * Keep in sync with the tool schemas in backend/services/llm_service.py.
 * Phrasing is present-participle ("Searching…") because these are rendered
 * while the step is running, and the timeline appends an ellipsis.
 */
export const TOOL_LABELS = {
  // Discovery
  search_hf_datasets: 'Searching Hugging Face',
  search_roboflow: 'Searching Roboflow',
  search_web: 'Searching the web',

  // Your own images
  list_image_uploads: 'Looking at your uploaded images',
  auto_label_images: 'Labeling your images',

  // Data + training
  prepare_dataset: 'Preparing dataset',
  inspect_dataset: 'Inspecting the dataset',
  plan_training: 'Planning the training run',
  start_training: 'Starting training',
  resume_training: 'Resuming from the checkpoint',
  get_training_status: 'Checking training status',
  get_training_history: 'Reviewing past runs',
  compare_training_runs: 'Comparing two runs',
  cancel_training: 'Stopping training',
  sleep_for_status: 'Waiting for training',
  trigger_background_task: 'Queueing background work',

  // Models: evaluate, ship, deliver
  list_models: 'Looking up your models',
  evaluate_model: 'Evaluating the model',
  export_model: 'Exporting for your hardware',
  deploy_model: 'Deploying to your device',

  // Workspace
  read_file: 'Reading a file',
  write_file: 'Writing a file',
  execute_command: 'Running a command',

  // App + session
  navigate: 'Opening a page',
  update_workflow_state: 'Updating workflow',
  call_mcp_tool: 'Calling an external tool',
  yield_to_user: 'Waiting for you',
};

/**
 * Label for a tool name, with a graceful fallback.
 *
 * Unknown names (a new backend tool, or a message persisted before its label
 * existed) become sentence case rather than a bare snake_case identifier:
 * `refine_labels` reads as "Refine labels", not "refine_labels".
 */
export function toolLabel(name) {
  if (TOOL_LABELS[name]) return TOOL_LABELS[name];

  const words = String(name || '').replace(/_/g, ' ').trim();
  if (!words) return 'Working';
  return words.charAt(0).toUpperCase() + words.slice(1);
}
