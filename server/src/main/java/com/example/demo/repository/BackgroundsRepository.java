package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Backgrounds;

public interface BackgroundsRepository extends JpaRepository<Backgrounds, Integer> {

}
