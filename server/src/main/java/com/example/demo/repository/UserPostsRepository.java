package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserPost;

public interface UserPostsRepository extends JpaRepository<UserPost, Integer> {

}
