package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data // getter・setterの自動設定
@Table(name="vacations") // テーブル自動生成時のテーブル名
public class Vacations {
	@Id	// プライマリーキー
	@GeneratedValue(strategy=GenerationType.IDENTITY) // オートインクリメント
	private Integer id;
	private Integer userId;
	private String vacationName;
	private LocalDate startDate;
	private LocalDate endDate;
	private LocalDate decisionDate;
	private Integer currentLocation;
}
