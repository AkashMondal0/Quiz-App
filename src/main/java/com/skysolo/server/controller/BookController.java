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
        List<BookEntry> books = bookService.getAllBooks();
        return ResponseEntity.ok(books); // 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookEntry> getBookById(@PathVariable String id) {
        return bookService.getBookById(id)
                .map(book -> ResponseEntity.ok(book)) // 200 OK
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found
    }

    @PostMapping("/{userId}")
    public ResponseEntity<BookEntry> createBook(@PathVariable String userId, @RequestBody BookEntry book) {
        BookEntry created = bookService.createBook(book, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED); // 201 Created
    }

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<BookEntry> updateBook(@PathVariable String id, @RequestBody BookEntry book) {
        Optional<BookEntry> existing = bookService.getBookById(id);
        if (existing.isPresent()) {
            BookEntry updated = bookService.updateBook(id, book);
            return ResponseEntity.ok(updated); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        Optional<BookEntry> existing = bookService.getBookById(id);
        if (existing.isPresent()) {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}