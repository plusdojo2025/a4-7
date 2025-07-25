package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Users;
import com.example.demo.repository.UsersRepository;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersRepository usersRepository;

    // 全ユーザー取得
    @GetMapping
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    // IDでユーザー取得
    @GetMapping("/{id}")
    public Optional<Users> getUserById(@PathVariable Integer id) {
        return usersRepository.findById(id);
    }

    // 新規ユーザー登録
    @PostMapping
    public Users createUser(@RequestBody Users user) {
        return usersRepository.save(user);
    }

    // ユーザー更新
    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Integer id, @RequestBody Users userDetails) {
        return usersRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword());
            user.setBackgroundId(userDetails.getBackgroundId());
            user.setAvatarId(userDetails.getAvatarId());
            return usersRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ユーザー削除
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        usersRepository.deleteById(id);
    }
}
