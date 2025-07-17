package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.HomeworkSchedules;

public interface HomeworkSchedulesRepository extends JpaRepository<HomeworkSchedules, Integer> {
	List<HomeworkSchedules> findByUserIdAndVacationId(Integer userId, Integer vacationId);
}
