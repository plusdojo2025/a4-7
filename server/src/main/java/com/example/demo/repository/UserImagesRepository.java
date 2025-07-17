package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserImages;

public interface UserImagesRepository extends JpaRepository<UserImages, Integer> {
	List<UserImages> findByUserId(String userId);
}
