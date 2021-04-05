
function alertModal(message='') {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modal.appendChild(modal);

  const header = document.createElement('h3');
  header.innerText = message;
  modalContent.appendChild(header);

  const button = document.createElement('button');
  button.classList.add('modal-close');
  header.appendChild(button);
  
  document.body.appendChild(modal);
}

export default alertModal;
