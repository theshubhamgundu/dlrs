package com.dlrs.dto;

import com.dlrs.model.PropertyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {
    private Long id;
    private String propertyUid;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String title;
    private String address;
    private Double area;
    private String gisCoordinates;
    private PropertyStatus status;
    private LocalDateTime createdAt;
}

