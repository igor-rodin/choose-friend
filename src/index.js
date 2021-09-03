import './scss/main.scss'
import { storage } from './js/storage'
import { utils } from './js/utils'
import { vkapi } from './js/vkapi'
import { renderFriendsList } from './js/friendsList';

const APP_ID = 7941229;
const ALL_FRIENDS_ZONE_ID = '1'
const BEST_FRIENDS_ZONE_ID = '2'

let vkFriends = [];

let friendsMap = new Map();
let bestFriendsMap = new Map();

const allFriendsState = {
  all: friendsMap,
  filtered: friendsMap
}

const bestFriendsState = {
  all: bestFriendsMap,
  filtered: bestFriendsMap
}

const allFriendsElem = document.querySelector('#friendsAll .friends__list');
const bestFriendsElem = document.querySelector('#friendsChoosed .friends__list');

const friendsZoneMap = new Map();
let srcZone = allFriendsElem;
let targetZone = bestFriendsElem;

friendsZoneMap.set(allFriendsElem, allFriendsState);
friendsZoneMap.set(bestFriendsElem, bestFriendsState);


const filterInputs = document.querySelectorAll('.friends__filter-input');
if (filterInputs.length) {
  filterInputs.forEach((input) => input.value = '');
}

///////////////////////////////////////////////
vkapi.auth(APP_ID)
  .then(() => vkapi.getFriends({ fields: 'photo_100' }))
  .then((data) => {
    vkFriends = data.items.map((user) => ({ id: user.id, full_name: `${user.first_name} ${user.last_name}`, photo: user.photo_100 }));
    renderUI(vkFriends);
  })
  .catch((err) => console.log(err));
///////////////////////////////////////////////
function renderUI(vkFriends) {
  const savedFriends = storage.getfromStorage(storage.friendsStorage);

  if (!savedFriends) {
    friendsMap = utils.ArrToMap(vkFriends);
    allFriendsState.all = friendsMap;
  } else {
    allFriendsState.all = utils.ArrToMap(savedFriends.all);
    bestFriendsState.all = utils.ArrToMap(savedFriends.best);
  }

  renderFriendsList(allFriendsElem, {
    list: allFriendsState.all
  });
  renderFriendsList(bestFriendsElem, {
    list: bestFriendsState.all,
    bestFriends: true
  });
}
///////////////////////////////////////////////
document.addEventListener('click', (evt) => {
  if (evt.target.parentElement.className.split(' ').some(val => val === 'friend__btn')) {
    let { elem, id } = getMovedElem(evt.target);
    moveFriendElem(elem, id);
  }
});
///////////////////////////////////////////////
document.addEventListener('dragstart', (evt) => {
  srcZone = findDropZoneOf(evt.target);
  const movedElem = evt.target.closest('.friend');
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('text/plain', movedElem.dataset.friendId);
})
///////////////////////////////////////////////
const droppedZones = document.querySelectorAll('[data-drop-zone]');
droppedZones.forEach((zone) => {
  zone.addEventListener('dragover', (evt) => evt.preventDefault());
});
///////////////////////////////////////////////
document.addEventListener('drop', (evt) => {
  evt.preventDefault();
  evt.dataTransfer.effectAllowed = 'move';
  const droppedElemId = evt.dataTransfer.getData('text/plain');
  const droppedElem = document.querySelector(`[data-friend-id='${droppedElemId}']`)
  targetZone = findDropZoneOf(evt.target);
  moveFriendElem(droppedElem, droppedElemId);
})
///////////////////////////////////////////////
document.addEventListener('input', (evt) => {
  const zoneId = evt.target.dataset.zoneId;
  const zone = document.querySelector(`[data-drop-zone='${zoneId}']`)
  const searchStr = evt.target.value;
  friendsZoneMap.get(zone).filtered = getFilteredFriends(friendsZoneMap.get(zone).all, searchStr);
  renderFriendsList(zone, {
    list: friendsZoneMap.get(zone).filtered,
    bestFriends: zoneId === BEST_FRIENDS_ZONE_ID
  })
})
///////////////////////////////////////////////
window.addEventListener('beforeunload', () => {
  storage.saveToStorage(storage.friendsStorage, friendsZoneMap.get(srcZone).all, friendsZoneMap.get(targetZone).all, srcZone.dataset.dropZone === ALL_FRIENDS_ZONE_ID);
})
///////////////////////////////////////////////
function getMovedElem(srcElem) {
  const elem = srcElem.closest('.friend')
  return { elem: elem, id: elem.dataset.friendId };
}
///////////////////////////////////////////////
function moveFriendElem(friendElem, idFriend) {
  const currentZone = findDropZoneOf(friendElem);
  if (currentZone !== srcZone) {
    targetZone = srcZone;
    srcZone = currentZone;
  }

  friendsZoneMap.get(srcZone).all.delete(idFriend);
  updateState(srcZone, targetZone, friendElem);

  updateFriendListView(srcZone);
  updateFriendListView(targetZone);
}
///////////////////////////////////////////////
function findDropZoneOf(elem) {
  if (elem.dataset.dropZone) {
    return elem
  };

  let parent = elem.parentElement;
  while (!parent.dataset.dropZone) {
    parent = parent.parentElement
  }
  return parent;
}
//////////////////////////////////////////////
function updateState(src, target, elem) {
  const id = parseInt(elem.dataset.friendId);

  friendsZoneMap.get(src).all.delete(id);

  const full_name = elem.querySelector('.friend__name').textContent;
  const photo = elem.querySelector('.friend__image').src;
  friendsZoneMap.get(target).all.set(id, { id, full_name, photo });
}
///////////////////////////////////////////////
function getFilteredFriends(friends, filterStr) {
  const filtered = new Map();
  friends.forEach((val, key) => {
    if (val.full_name.toLowerCase().includes(filterStr.trim().toLowerCase())) {
      filtered.set(key, val);
    }
  });

  return filtered;
}
///////////////////////////////////////////////
function updateFriendListView(view) {
  const viewId = view.dataset.dropZone;
  const searchStr = document.querySelector(`[data-zone-id='${viewId}']`).value;
  friendsZoneMap.get(view).filtered = getFilteredFriends(friendsZoneMap.get(view).all, searchStr);
  renderFriendsList(view, {
    list: friendsZoneMap.get(view).filtered,
    bestFriends: viewId === BEST_FRIENDS_ZONE_ID
  });
};