package com.skysolo.server.controller;

import com.skysolo.server.entry.BookEntry;
import com.skysolo.server.service.BookService;
import com.skysolo.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookService;
    @Autowired
    private UserService userService;


  @GetMapping
  public ResponseEntity<List<BookEntry>> getAllBooks() {
      try {
          List<BookEntry> books = bookService.getAllBooks();
          return ResponseEntity.ok(books); // 200 OK
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookEntry> getBookById(@PathVariable String id) {
      try {
          return bookService.getBookById(id)
                  .map(book -> ResponseEntity.ok(book)) // 200 OK
                  .orElse(ResponseEntity.notFound().build()); // 404 Not Found
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @PostMapping("/{userId}")
  public ResponseEntity<?> createBook(@PathVariable String userId, @RequestBody BookEntry book) {
      try {
          BookEntry created = bookService.createBook(book, userId);
          return new ResponseEntity<>(created, HttpStatus.CREATED); // 201 Created
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("Error creating book: " + e.getMessage());
      }
  }

  @PutMapping("/{userId}/{id}")
  public ResponseEntity<BookEntry> updateBook(@PathVariable String id, @RequestBody BookEntry book) {
      try {
          Optional<BookEntry> existing = bookService.getBookById(id);
          if (existing.isPresent()) {
              BookEntry updated = bookService.updateBook(id, book);
              return ResponseEntity.ok(updated); // 200 OK
          } else {
              return ResponseEntity.notFound().build(); // 404 Not Found
          }
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBook(@PathVariable String id) {
      try {
          Optional<BookEntry> existing = bookService.getBookById(id);
          if (existing.isPresent()) {
              bookService.deleteBook(id);
              return ResponseEntity.noContent().build(); // 204 No Content
          } else {
              return ResponseEntity.notFound().build(); // 404 Not Found
          }
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }
}