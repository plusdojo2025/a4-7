package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.PrivateSchedules;

public interface PrivateSchedulesRepository extends JpaRepository<PrivateSchedules, Integer> {
	List<PrivateSchedules> findByUserIdAndVacationId(String userId, int vacationId);
}
