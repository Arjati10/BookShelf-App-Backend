const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksWithCompleteDataHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let finished = false;
  const id = nanoid(16);
  if (pageCount === readPage) {
    finished = true;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const allBooks = books;
  const hasilMap = allBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (books.length !== 0) {
    if (name) {
      const filteredName = books.filter((b) => (b.name = name));
      const hasilMapNama = filteredName.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

      const response = h.response({
        status: "success",
        data: {
          books: hasilMapNama,
        },
      });
      response.code(200);
      return response;
    }

    if (reading) {
      if (reading === "0") {
        const filteredRead = books.filter((b) => b.reading === false);
        const hasilMapRead = filteredRead.map((books) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher,
        }));

        const response = h.response({
          status: "success",
          data: {
            books: hasilMapRead,
          },
        });
        response.code(200);
        return response;
      }
      if (reading === "1") {
        const filteredRead = books.filter((b) => b.reading === true);
        const hasilMapRead = filteredRead.map((books) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher,
        }));

        const response = h.response({
          status: "success",
          data: {
            books: hasilMapRead,
          },
        });
        response.code(200);
        return response;
      }
    }

    if (finished) {
      if (finished === "0") {
        const filteredFinished = books.filter((b) => b.pageCount > b.readPage);
        const hasilMapFinished = filteredFinished.map((books) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher,
        }));

        const response = h.response({
          status: "success",
          data: {
            books: hasilMapFinished,
          },
        });
        response.code(200);
        return response;
      }
      if (finished === "1") {
        const filteredFinished = books.filter(
          (b) => b.pageCount === b.readPage
        );
        const hasilMapFinished = filteredFinished.map((books) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher,
        }));

        const response = h.response({
          status: "success",
          data: {
            books: hasilMapFinished,
          },
        });
        response.code(200);
        return response;
      }
    }

    const response = h.response({
      status: "success",
      data: {
        books: hasilMap,
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    } else if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    } else {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      };

      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksWithCompleteDataHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
