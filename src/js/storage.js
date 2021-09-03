import { utils } from "./utils";

const STORAGE_NAME = 'vkFriends'

export const storage = {
  friendsStorage: window.localStorage,

  saveToStorage(storage, all, best, isAllZone) {
    const allArr = utils.MapToArray(all);
    const bestArr = utils.MapToArray(best);

    const jsonStr = JSON.stringify({
      all: isAllZone ? allArr : bestArr,
      best: isAllZone ? bestArr : allArr,
    })

    storage.setItem(STORAGE_NAME, jsonStr);
  },

  getfromStorage(storage) {
    if (!storage.getItem(STORAGE_NAME)) {
      return false;
    }

    return JSON.parse(storage.getItem(STORAGE_NAME));
  }
}

