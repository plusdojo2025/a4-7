package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Vacations;

public interface VacationsRepository extends JpaRepository<Vacations, Integer> {
	List<Vacations> findByUserIdOrderByStartDateDesc(Integer userId);
}
