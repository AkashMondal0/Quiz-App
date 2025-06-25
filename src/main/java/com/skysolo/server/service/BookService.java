package com.skysolo.server.service;

import com.skysolo.server.entry.BookEntry;
import com.skysolo.server.entry.UserEntry;
import com.skysolo.server.repository.BookRepository;
import com.skysolo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BookEntry> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<BookEntry> getBookById(String id) {
        return bookRepository.findById(id);
    }

    @Transactional
    public BookEntry createBook(BookEntry book, String ownerId) {
        try{
            // Fetch user by ID
            UserEntry user = userRepository.findById(ownerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            book.setDate(LocalDate.now());

            // Save book
            BookEntry savedBook = bookRepository.save(book);

            // Add book to user's book list
            user.getBooks().add(savedBook);
            userRepository.save(user);

            return savedBook;
        } catch (Exception e) {
            System.out.println("Error creating book: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public BookEntry updateBook(String id, BookEntry book) {
        book.setId(id);
        return bookRepository.save(book);
    }

    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }
}
