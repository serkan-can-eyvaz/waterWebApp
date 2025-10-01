package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.QrInfoDto;
import com.waterwebapp.backend.entity.QrInfo;
import com.waterwebapp.backend.repository.QrInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class QrInfoService {

    @Autowired
    private QrInfoRepository qrInfoRepository;

    public QrInfoDto upsert(QrInfoDto dto) {
        QrInfo entity = new QrInfo();
        entity.setCompanyTaxNumber(dto.getCompanyTaxNumber());
        entity.setCompanyName(dto.getCompanyName());
        entity.setAddress(dto.getAddress());
        entity.setInstagramUrl(dto.getInstagramUrl());
        entity.setTwitterUrl(dto.getTwitterUrl());
        entity.setLinkedinUrl(dto.getLinkedinUrl());
        QrInfo saved = qrInfoRepository.save(entity);
        QrInfoDto out = new QrInfoDto();
        out.setCompanyTaxNumber(saved.getCompanyTaxNumber());
        out.setCompanyName(saved.getCompanyName());
        out.setAddress(saved.getAddress());
        out.setInstagramUrl(saved.getInstagramUrl());
        out.setTwitterUrl(saved.getTwitterUrl());
        out.setLinkedinUrl(saved.getLinkedinUrl());
        return out;
    }

    public Optional<QrInfoDto> findByTaxNumber(String taxNumber) {
        return qrInfoRepository.findById(taxNumber).map(e -> {
            QrInfoDto dto = new QrInfoDto();
            dto.setCompanyTaxNumber(e.getCompanyTaxNumber());
            dto.setCompanyName(e.getCompanyName());
            dto.setAddress(e.getAddress());
            dto.setInstagramUrl(e.getInstagramUrl());
            dto.setTwitterUrl(e.getTwitterUrl());
            dto.setLinkedinUrl(e.getLinkedinUrl());
            return dto;
        });
    }
}


