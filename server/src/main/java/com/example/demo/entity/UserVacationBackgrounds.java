package com.example.demo.entity;

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
@Table(name="user_vacation_backgrounds") // テーブル自動生成時のテーブル名
public class UserVacationBackgrounds {
	@Id	// プライマリーキー
	@GeneratedValue(strategy=GenerationType.IDENTITY) // オートインクリメント
	private Integer id;
	private Integer vacationsId;
	private Integer backgroundsId;
	private Integer isGain;
	private Integer contentOrder;
}
