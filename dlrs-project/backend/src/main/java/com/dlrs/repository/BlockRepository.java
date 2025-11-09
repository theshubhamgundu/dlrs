package com.dlrs.repository;

import com.dlrs.model.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockIndex(Integer blockIndex);
    Optional<Block> findByTransactionId(Long transactionId);
    
    @Query("SELECT b FROM Block b ORDER BY b.blockIndex ASC")
    List<Block> findAllOrderByBlockIndex();
    
    @Query("SELECT b FROM Block b WHERE b.transaction.property.id = :propertyId ORDER BY b.blockIndex ASC")
    List<Block> findByPropertyId(@Param("propertyId") Long propertyId);
    
    @Query("SELECT MAX(b.blockIndex) FROM Block b")
    Integer findMaxBlockIndex();
}

