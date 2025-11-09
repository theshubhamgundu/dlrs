package com.dlrs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private Long propertyId;
    private String fileName;
    private String filePath;
    private String fileChecksum;
    private Long uploadedById;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
}

