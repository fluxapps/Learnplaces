<?php

namespace SRAG\Learnplaces\gui\helper;

/**
 * Class DIC
 *
 * @author Fabian Schmid <fs@studer-raimann.ch>
 */
trait DIC {

	/**
	 * @return \ILIAS\DI\Container
	 */
	public function dic() {
		return $GLOBALS['DIC'];
	}


	/**
	 * @return \ilCtrl
	 */
	protected function ctrl() {
		return $this->dic()->ctrl();
	}


	/**
	 * @param $variable
	 *
	 * @return string
	 */
	public function txt($variable) {
		return $this->lng()->txt($variable);
	}


	/**
	 * @return \ilTemplate
	 */
	protected function tpl() {
		return $this->dic()->ui()->mainTemplate();
	}


	/**
	 * @return \ilLanguage
	 */
	protected function lng() {
		return $this->dic()->language();
	}


	/**
	 * @return \ilTabsGUI
	 */
	protected function tabs() {
		return $this->dic()->tabs();
	}


	/**
	 * @return \ILIAS\DI\UIServices
	 */
	protected function ui() {
		return $this->dic()->ui();
	}


	/**
	 * @return \ilObjUser
	 */
	protected function user() {
		return $this->dic()->user();
	}


	/**
	 * @return mixed
	 * @throws \Exception
	 */
	protected function http() {
		throw new \Exception('Not implemented');

		return $this->dic()->http();
	}


	/**
	 * @return \ilAccessHandler
	 */
	public function access() {
		return $this->dic()->access();
	}
}
