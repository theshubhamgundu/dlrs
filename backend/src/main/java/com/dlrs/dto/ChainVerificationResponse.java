package com.dlrs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChainVerificationResponse {
    private boolean isValid;
    private String message;
    private List<TamperedBlockInfo> tamperedBlocks;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TamperedBlockInfo {
        private Integer blockIndex;
        private String issue;
        private String expectedHash;
        private String actualHash;
    }
}

