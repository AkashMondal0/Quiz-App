package com.skysolo.quiz.utils;

import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.dto.CachedUserDTO;
import com.skysolo.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
public class UserInfoService implements UserDetailsService {
    private static final String PREFIX = "USER:";
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Object cached = redisTemplate.opsForValue().get(PREFIX + email);
        if (cached instanceof CachedUserDTO cachedUser) {
            return new User(
                    cachedUser.getEmail(),
                    cachedUser.getPassword(),
                    cachedUser.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
            );
        }

        UserEntry user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities()
        );
    }

    public UserEntry getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
