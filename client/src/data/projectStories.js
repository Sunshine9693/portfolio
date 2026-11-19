// Defaults for existing project records that predate the challenge/result fields.
export const projectStories = {
  'aura-voice-assistant': {
    challenge: "Keeping each user's saved notes separate.",
    result: 'Notes are stored with a user ID. The API scopes reading, editing, and deleting notes to the signed-in user.',
  },
  'snapshoes-ecommerce': {
    challenge: 'Keeping cart quantities and totals consistent as items change.',
    result: 'Shared React state tracks the cart, totals are calculated from its items, and local storage keeps the cart between visits.',
  },
  'hostel-allocation-system': {
    challenge: 'Connecting the application screens, backend APIs, and database.',
    result: 'The project connects student applications and room-allotment data through a shared API and database workflow.',
  },
  'task-management-system': {
    challenge: 'Keeping tasks and their priorities after a page refresh.',
    result: 'Tasks are saved in local storage, restored on load, and sorted by priority and due date.',
  },
  'music-player-spotify-clone': {
    challenge: 'Keeping the seek bar and play/pause controls in sync with the audio.',
    result: 'Audio events update the seek bar, and seeking or changing tracks updates the playback position and controls.',
  },
};

export function withProjectStory(project) {
  const defaults = projectStories[project.id];
  if (!defaults) return project;
  return { ...defaults, ...project };
}
