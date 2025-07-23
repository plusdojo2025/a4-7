package com.example.demo.entity;

import java.util.Base64;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name="books")
public class Books {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	private String author;
	private String name;
	private String overview;
	private Integer pages;
	@Lob
	@JsonIgnore
	private byte[] image;
	private Integer grade;
	@Transient // JPAを使用している場合、DBに永続化しないことを示す
    private String ImageData; // Base64エンコードされた画像データ（JSON出力用）
	
	public Books(Integer id, String author,String name,String overview,Integer pages ,Integer grade, byte[] image) {
        this.id = id;
        this.author=author;
        this.name = name;
        this.overview=overview;
        this.pages=pages;
        this.grade = grade;
        this.image = image;
        // コンストラクタでbase64ImageDataを初期化することも可能
        if (image != null) {
            this.ImageData = Base64.getEncoder().encodeToString(image);
        }
    }
	
	
	// ゲッターとセッター
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }
    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }

    @JsonIgnore // JSON出力時にこのゲッターを無視させる
    public byte[] getImage() { return image; }
    public void setImage(byte[] image) {
        this.image = image;
        // setImage時にbase64ImageDataも更新
        this.ImageData = (image != null) ? Base64.getEncoder().encodeToString(image) : null;
    }

    // JSON出力用のゲッター
    @JsonProperty("ImageData") // JSONでのプロパティ名を指定
    public String getImageData() {
        return ImageData;
    }
    // Base64ImageDataのセッターは通常不要だが、もし必要なら追加
    public void setImageData(String ImageData) {
        this.ImageData = ImageData;
    }
}
