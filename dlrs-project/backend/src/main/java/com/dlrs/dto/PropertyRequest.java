package com.dlrs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PropertyRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String address;
    
    @NotNull
    private Double area;
    
    private String gisCoordinates;
}

