<?php
declare(strict_types=1);

namespace SRAG\Learnplaces\persistence\dao;

use SRAG\Learnplaces\persistence\entity\VisitJournal;

/**
 * Class VisitJournalDaoImpl
 *
 * @package SRAG\Learnplaces\persistence\dao
 *
 * @author  Nicolas Schäfli <ns@studer-raimann.ch>
 */
class VisitJournalDaoImpl extends AbstractCrudDao implements VisitJournalDao {

	/**
	 * VisitJournalDaoImpl constructor.
	 */
	public function __construct() {
		parent::__construct(VisitJournal::class);
	}


	/**
	 * Searches all visits by learnplace id.
	 *
	 * @param int $id The id which should be used to search all the visits.
	 *
	 * @return VisitJournal[] A collection of all found visits.
	 */
	public function findByLearnplaceId(int $id) : array {
		return VisitJournal::where(['fk_learnplace_id' => $id])->get();
	}
}