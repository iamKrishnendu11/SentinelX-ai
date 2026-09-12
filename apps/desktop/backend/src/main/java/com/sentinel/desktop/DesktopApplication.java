package com.sentinel.desktop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class DesktopApplication {

    public static void main(String[] args) {
        ensureDatabaseDirectory();
        SpringApplication.run(DesktopApplication.class, args);
    }

    private static void ensureDatabaseDirectory() {
        try {
            String dbPath = System.getenv("DB_PATH");
            if (dbPath == null || dbPath.isBlank()) {
                dbPath = System.getProperty("DB_PATH", "data/sentinel-x.db");
            }
            File dbFile = new File(dbPath);
            File parentDir = dbFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }
        } catch (Exception e) {
            System.err.println("Could not create database directory: " + e.getMessage());
        }
    }

}
