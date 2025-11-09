package com.dlrs.service;

import com.dlrs.dto.BlockResponse;
import com.dlrs.dto.ChainVerificationResponse;
import com.dlrs.model.Block;
import com.dlrs.model.Transaction;
import com.dlrs.repository.BlockRepository;
import com.dlrs.util.BlockchainUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlockService {

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private BlockchainUtil blockchainUtil;

    @Transactional
    public Block createBlock(Transaction transaction) {
        // Ensure transaction relationships are loaded
        // Access them to trigger lazy loading within transaction
        transaction.getProperty().getId();
        transaction.getBuyer().getId();
        transaction.getSeller().getId();
        
        // Get the previous block to get its hash
        Block previousBlock = getLastBlock();
        String previousHash = previousBlock != null 
                ? previousBlock.getCurrentHash() 
                : blockchainUtil.getGenesisHash();

        // Calculate block index
        Integer blockIndex = (previousBlock != null ? previousBlock.getBlockIndex() + 1 : 0);

        // Calculate data hash
        String dataHash = blockchainUtil.calculateDataHash(transaction);

        // Simple nonce (in a real blockchain, this would be a proof-of-work)
        Long nonce = System.currentTimeMillis();

        // Calculate current hash
        LocalDateTime timestamp = LocalDateTime.now();
        String currentHash = blockchainUtil.calculateCurrentHash(
                blockIndex, timestamp, transaction, previousHash, nonce);

        // Create and save block
        Block block = new Block();
        block.setBlockIndex(blockIndex);
        block.setTimestamp(timestamp);
        block.setTransaction(transaction);
        block.setDataHash(dataHash);
        block.setPreviousHash(previousHash);
        block.setCurrentHash(currentHash);
        block.setNonce(nonce);

        return blockRepository.save(block);
    }

    public Block getLastBlock() {
        Integer maxIndex = blockRepository.findMaxBlockIndex();
        if (maxIndex == null) {
            return null;
        }
        return blockRepository.findByBlockIndex(maxIndex).orElse(null);
    }

    public List<BlockResponse> getAllBlocks() {
        List<Block> blocks = blockRepository.findAllOrderByBlockIndex();
        return blocks.stream()
                .map(this::toBlockResponse)
                .collect(Collectors.toList());
    }

    public List<BlockResponse> getBlocksByPropertyId(Long propertyId) {
        List<Block> blocks = blockRepository.findByPropertyId(propertyId);
        return blocks.stream()
                .map(this::toBlockResponse)
                .collect(Collectors.toList());
    }

    public ChainVerificationResponse verifyChain(Long propertyId) {
        List<Block> blocks;
        if (propertyId != null) {
            blocks = blockRepository.findByPropertyId(propertyId);
        } else {
            blocks = blockRepository.findAllOrderByBlockIndex();
        }

        if (blocks.isEmpty()) {
            return ChainVerificationResponse.builder()
                    .isValid(true)
                    .message("Chain is empty or no blocks found for this property")
                    .tamperedBlocks(new ArrayList<>())
                    .build();
        }

        List<ChainVerificationResponse.TamperedBlockInfo> tamperedBlocks = new ArrayList<>();
        Block previousBlock = null;

        for (Block block : blocks) {
            boolean isValid = blockchainUtil.verifyBlock(block, previousBlock);
            
            if (!isValid) {
                String issue = "Block hash mismatch or invalid link";
                if (previousBlock != null && !block.getPreviousHash().equals(previousBlock.getCurrentHash())) {
                    issue = "Previous hash link is broken";
                }

                tamperedBlocks.add(ChainVerificationResponse.TamperedBlockInfo.builder()
                        .blockIndex(block.getBlockIndex())
                        .issue(issue)
                        .expectedHash(blockchainUtil.calculateCurrentHash(
                                block.getBlockIndex(),
                                block.getTimestamp(),
                                block.getTransaction(),
                                block.getPreviousHash(),
                                block.getNonce()))
                        .actualHash(block.getCurrentHash())
                        .build());
            }

            previousBlock = block;
        }

        boolean isValid = tamperedBlocks.isEmpty();
        String message = isValid 
                ? "Chain verification successful. All blocks are valid." 
                : "Chain verification failed. Found " + tamperedBlocks.size() + " tampered block(s).";

        return ChainVerificationResponse.builder()
                .isValid(isValid)
                .message(message)
                .tamperedBlocks(tamperedBlocks)
                .build();
    }

    private BlockResponse toBlockResponse(Block block) {
        // Note: Transaction details would need to be loaded separately if needed
        return BlockResponse.builder()
                .id(block.getId())
                .blockIndex(block.getBlockIndex())
                .timestamp(block.getTimestamp())
                .transactionId(block.getTransaction().getId())
                .dataHash(block.getDataHash())
                .previousHash(block.getPreviousHash())
                .currentHash(block.getCurrentHash())
                .nonce(block.getNonce())
                .build();
    }
}

