package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserVacationBackgrounds;

public interface UserVacationBgImgsRepository extends JpaRepository<UserVacationBackgrounds, Integer> {
	List<UserVacationBackgrounds> findByVacationsIdOrderByContentOrderAsc(Integer vacationsId);
}
