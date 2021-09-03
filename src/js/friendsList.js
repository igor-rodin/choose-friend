import { renderFriend } from './friend'

export function renderFriendsList(srcElem, options) {
  srcElem.innerHTML = '';
  if (!options.list.size) {
    return false;
  }

  const btnImage = options.bestFriends ? './images/btn-cross.svg' : './images/btn-right.svg'

  const fragment = document.createDocumentFragment();
  options.list.forEach((val, key) => {
    fragment.append(renderFriend({
      avatar: val.photo,
      name: val.full_name,
      id: key,
      btnImg: btnImage
    }));
  });

  srcElem.append(fragment);
}