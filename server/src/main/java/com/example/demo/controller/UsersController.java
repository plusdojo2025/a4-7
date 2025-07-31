package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    
    
    // ログイン処理
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users loginRequest) {
        Users user = usersRepository.findFirstByUsernameAndPassword(
            loginRequest.getUsername(), loginRequest.getPassword()
        );

        // エラーハンドル
        if (user == null) {
            // 401 Unauthorized で返す
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 成功時はユーザーIDだけ返す
        return ResponseEntity.ok(user.getId());
    }
    
    // 新規登録処理
    @PostMapping("/signup")
    public ResponseEntity<Void> signupUser(@RequestBody Users user) {
        if (usersRepository.findByUsername(user.getUsername()).isPresent()) {
            // 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        usersRepository.save(user);

        // 登録成功は201 Created
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
//    @GetMapping("/{username}")
//    public Optional<Users> getUserByUserName(@PathVariable String username) {
//        return usersRepository.findFirstByUsername(username);
//    }
    
}
