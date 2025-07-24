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

import com.example.demo.entity.UserImages;
import com.example.demo.repository.UserImagesRepository;

@RestController
@RequestMapping("/user-images")
public class UserImagesController {

    @Autowired
    private UserImagesRepository userImagesRepository;

    // 全てのUserImagesを取得
    @GetMapping
    public List<UserImages> getAllUserImages() {
        return userImagesRepository.findAll();
    }

    // ID指定で1件取得
    @GetMapping("/{id}")
    public Optional<UserImages> getUserImageById(@PathVariable Integer id) {
        return userImagesRepository.findById(id);
    }

    // 新規作成
    @PostMapping
    public UserImages createUserImage(@RequestBody UserImages userImage) {
        return userImagesRepository.save(userImage);
    }

    // 更新
    @PutMapping("/{id}")
    public UserImages updateUserImage(@PathVariable Integer id, @RequestBody UserImages updated) {
        return userImagesRepository.findById(id).map(image -> {
            image.setUserId(updated.getUserId());
            image.setImageType(updated.getImageType());
            image.setImageId(updated.getImageId());
            return userImagesRepository.save(image);
        }).orElseThrow(() -> new RuntimeException("UserImage not found with id: " + id));
    }

    // 削除
    @DeleteMapping("/{id}")
    public void deleteUserImage(@PathVariable Integer id) {
        userImagesRepository.deleteById(id);
    }

    // ユーザーIDと画像タイプで取得（オプション）
    @GetMapping("/user/{userId}")
    public List<UserImages> getImagesByUserId(@PathVariable Integer userId) {
        return userImagesRepository.findByUserId(userId);
    }
    
 // ユーザーIDと画像タイプで取得（オプション）
    @GetMapping("/useravatar/{userId}")
    public List<UserImages> getAvatarImagesByUserId(@PathVariable Integer userId) {
        return userImagesRepository.findByUserIdAndImageType(userId, "1");
    }
}
