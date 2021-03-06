const connection = require('../config/db');
const bookModel = {
  getBooks: (search, sort = 'title', page, limit) => {
    return new Promise((resolve, reject) => {
      if (search) {
        connection.query('SELECT `books`.*, `category`.`name_category` FROM `books` JOIN `category` ON `books`.`id_category` = `category`.`id` WHERE lower(`books`.`title`) LIKE ? OR lower(`books`.`description`) LIKE ? OR lower(`books`.`author`) LIKE ? OR lower(`category`.`name_category`) LIKE ?', [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`], (err, result) => {
          if (err) {
            reject(new Error(err));
          }
          resolve(result);
        });
      } else {
        if (sort) {
          if (page || limit) {
            connection.query('SELECT `books`.*, `category`.`name_category` FROM `books` JOIN `category` ON `books`.`id_category` = `category`.`id` ORDER BY `books`.`' + sort + '` LIMIT ' + page + ',' + limit + '', (err, result) => {
              if(err || result.length < 1) {
                reject(new Error(err));
              }
              resolve(result);
            });
          }
          connection.query('SELECT `books`.*, `category`.`name_category` FROM `books` JOIN `category` ON `books`.`id_category` = `category`.`id` ORDER BY `books`.`' + sort + '` LIMIT ' + page + ',' + limit + '', (err, result) => {
            if(err) {
              reject(new Error(err));
            }
            resolve(result);
          });
        }
      }
    });
  },
  bookDetail: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT `books`.*, `category`.`name_category` FROM `books` JOIN `category` ON `books`.`id_category` = `category`.`id` WHERE `books`.`id` = ?', id, (err, result) => {
        if(err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  insertBook: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `books` SET ?', data, (err, result) => {
        if (err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  updateBook: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE `books` SET ? WHERE id = ?', [data, id], (err, result) => {
        if(err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  deleteBook: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM `books` WHERE id = ?', id, (err, result) => {
        if(err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  loanList: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT `loan`.*, `users`.`email`, `users`.`fullname`, `books`.`title`, `books`.`img`, `loan`.`forfeit` FROM `loan` JOIN `users` ON `loan`.`id_user` = `users`.`id` JOIN `books` ON `loan`.`id_book` = `books`.`id`', (err, result) => {
        if (err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  loanBook: (dataLoan) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `loan` SET ?', dataLoan, (err, result) => {
        if (err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  },
  returnBook: (dataReturn) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE `library`.`loan` SET `return_at` = ?, `status_loan` = ? WHERE id = ?', [dataReturn.return_at, dataReturn.status_loan, dataReturn.id], (err, result) => {
        if (err) {
          reject(new Error(err));
        }
        resolve(result);
      });
    });
  }
};

module.exports = bookModel;