package com.example.demo.entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
	private String userId;
	private String vacationName;
	private Date startDate;
	private Date endDate;
	
	@OneToMany(mappedBy="vacations"
			,cascade=CascadeType.ALL
			,fetch=FetchType.LAZY)
	List<PrivateSchedules> privateSchedules;
}
