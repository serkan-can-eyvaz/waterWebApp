package com.waterwebapp.backend.repository;

import com.waterwebapp.backend.entity.QrInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QrInfoRepository extends JpaRepository<QrInfo, String> {
}


