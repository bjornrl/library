class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = "0",
    yearPublished = "0",
    isRead = "false"
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.yearPublished = yearPublished;
    this.isRead = isRead;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  getBook(title) {
    return this.book.find((book) => book.title === title);
  }

  isInLibrary(newBook) {
    return this.book.some((book) => book.title === newBook.title);
  }
}

const library = new Library();

//UI

const loggedOut = document.getElementById("loggedOut");
const loggedIn = document.getElementById("loggedIn");
const accountBtn = document.getElementById("accountBtn");
const addBookBtn = document.getElementById("addBookBtn");
const addBookModal = document.getElementById("addBookModal");
const addBookForm = document.getElementById("addBookForm");
const errorMsg = document.getElementById("errorMsg");
const overlay = document.getElementById("overlay");
const booksGrid = document.getElementById("booksGrid");
const accountModal = document.getElementById("accountModal");

const setupNavbar = (user) => {
  if (user) {
    loggedIn.classList.add("active");
    loggedOut.classList.remove("active");
  } else {
    loggedIn.classList.remove("active");
    loggedOut.classList.add("active");
  }
};

const setupAccountModal = (user) => {
  if (user) {
    accountModal.innerHTML = `
      <p>Logged in as</p>
      <p><strong>${user.email.split("@")[0]}</strong></p>`;
  } else {
    accountModal.innerHTML = "";
  }
};

const openAddBookModal = () => {
  addBookForm.reset();
  addBookModal.classList.add("active");
  overlay.classList.add("active");
};

const closeAddBookModal = () => {
  addBookModal.classList.remove("active");
  overlay.classList.remove("active");
  errorMsg.classList.remove("active");
  errorMsg.textContent = "";
};

const openAccountModal = () => {
  accountModal.classList.add("active");
  overlay.classList.add("active");
};

const closeAccountModal = () => {
  accountModal.classList.remove("active");
  overlay.classList.remove("active");
};

const closeAllModals = () => {
  closeAccountModal();
  closeAddBookModal();
};

const handleKeyboardInput = (e) => {
  if (e.key === "Escape") closeAllModals();
};

const updateBooksGrid = () => {
  resetBooksGrid();
  for (let book of library.books) {
    createBookCard(book);
  }
};

const resetBooksGrid = () => {
  booksGrid.innerHTML = "";
};

const createBookCard = (book) => {
  const bookCard = document.createElement("div");
  const title = document.createElement("h3");
  const author = document.createElement("h3");
  const pages = document.createElement("h3");
  const yearPublished = document.createElement("h3");
  const readBtn = document.createElement("button");
  const removeBtn = document.createElement("button");

  bookCard.classList.add("bookCard");
  readBtn.classList.add("btn");
  removeBtn.classList.add("btn");
  removeBtn.classList.add("btn-red");
  readBtn.onclick = toggleRead;
  removeBtn.onclick = removeBook;

  title.textContent = `"${book.title}`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  removeBtn.textContent = "Remove";

  if (book.isRead) {
    readBtn.textContent = "Read";
    readBtn.classList.add("btn-light-green");
  } else {
    readBtn.textContent = "Not read";
    readBtn.classList.add("btn-light-red");
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(yearPublished);
  bookCard.appendChild(readBtn);
  bookCard.appendChild(removeBtn);
  booksGrid.appendChild(bookCard);
};

const getBookFromInput = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const yearPublished =
    document.getElementById("yearPublished").value;
  const isRead = document.getElementById("isRead").checked;
  return new Book(title, author, pages, yearPublished, isRead);
};

const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();

  if (library.isInLibrary(newBook)) {
    errorMsg.textContent = "This book is already in your library";
    errorMsg.classList.add("active");
    return;
  }

  if (auth.currentUser) {
    addBookDB(newBook);
  } else {
    library.addBook(newBook);
    saveLocal();
    updateBooksGrid();
  }

  closeAddBookModal();
};

const removeBook = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ""
  );

  if (auth.currentUser) {
    removeBook(title);
  } else {
    library.removeBook(title);
    saveLocal();
    updateBooksGrid();
  }
};

const toggleRead = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ""
  );
  const book = library.getBook(title);

  if (auth.currentUser) {
    toggleBookIsReadDB(book);
  } else {
    book.isRead = !book.isRead;
    saveLocal();
    updateBooksGrid();
  }
};

accountBtn.onclick = openAccountModal;
addBookModal.onclick = openAddBookModal;
overlay.onclick = closeAllModals;
addBookForm.onsubmit = addBook;
window.onkeydown = handleKeyboardInput;

const saveLocal = () => {
  localStorage.setItem("library", JSON.stringify(library.books));
};

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem("library"));
  library.books = books ? books.map((book) => JSONToBook(book)) : [];
};
