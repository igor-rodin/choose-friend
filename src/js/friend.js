import FriendTemplate from '../templates/friend.hbs'

export function renderFriend(options) {
  const friendElem = document.createElement('li');
  friendElem.classList.add('friends__item', 'friend');
  friendElem.setAttribute('draggable', true);
  friendElem.setAttribute('data-friend-id', options.id)
  friendElem.insertAdjacentHTML('afterbegin', FriendTemplate({
    name: options.name,
    avatar: options.avatar,
    btn_img: options.btnImg
  }));

  return friendElem;
}