<?php
namespace fluxlabs\learnplaces\Core\Ports;
use fluxlabs\learnplaces\Core\Domain\Models\Course;

interface Outbounds {
    public function getApiBaseUrl(): string;

    public function getAllLearnplaceRefIds() : array;
    /**
     * @param array $groupedLearnplaceRefIds
     * @return Course[]
     */
    public function getLearnplaceCourses($groupedLearnplaceRefIds) : array;

    public function groupReadableLearnplacesByCourses(array $ref_ids) : array;
}