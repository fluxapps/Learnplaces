<?php
declare(strict_types=1);

namespace SRAG\Learnplaces\gui\component;

use ilTemplate;

/**
 * Class PlusGUI
 *
 * Draws a full width button with a plus sign in the middle which
 * links to the add block gui.
 *
 * @package SRAG\Learnplaces\gui\component
 *
 * @author  Nicolas Schäfli <ns@studer-raimann.ch>
 */
final class PlusView {

	const POSITION_QUERY_PARAM = 'position';

	/**
	 * @var string $link
	 */
	private $link;


	/**
	 * PlusView constructor.
	 *
	 * @param int    $sequence
	 * @param string $link
	 */
	public function __construct(int $sequence, string $link) {
		$this->link = "$link&" . self::POSITION_QUERY_PARAM . "=$sequence";
	}


	public function getHTML(): string {
		$template = new ilTemplate('./Customizing/global/plugins/Services/Repository/RepositoryObject/Learnplaces/templates/default/component/tpl.plus.html', true, true);
		$template->setVariable('LINK', $this->link);
		return $template->get();
	}
}