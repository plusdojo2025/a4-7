package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Avatars;

public interface AvatarsRepository extends JpaRepository<Avatars, Integer> {
	

}
