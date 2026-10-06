package com.studyloop.model;

import jakarta.persistence.*;

@Entity
@Table(name = "platform_settings")
public class PlatformSettings {

    @Id
    private String id = "default_settings";

    private Integer maxClassPrice = 500;
    private Integer platformFeePercent = 10;
    private Integer minClassesForPaidTeaching = 10;

    public PlatformSettings() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getMaxClassPrice() { return maxClassPrice; }
    public void setMaxClassPrice(Integer maxClassPrice) { this.maxClassPrice = maxClassPrice; }

    public Integer getPlatformFeePercent() { return platformFeePercent; }
    public void setPlatformFeePercent(Integer platformFeePercent) { this.platformFeePercent = platformFeePercent; }

    public Integer getMinClassesForPaidTeaching() { return minClassesForPaidTeaching; }
    public void setMinClassesForPaidTeaching(Integer minClassesForPaidTeaching) { this.minClassesForPaidTeaching = minClassesForPaidTeaching; }
}
