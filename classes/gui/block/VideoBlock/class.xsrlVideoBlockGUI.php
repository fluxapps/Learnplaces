<?php
declare(strict_types=1);

use ILIAS\HTTP\GlobalHttpState;
use SRAG\Learnplaces\gui\block\util\InsertPositionAware;
use SRAG\Learnplaces\gui\block\VideoBlock\VideoBlockEditFormView;
use SRAG\Learnplaces\gui\block\VideoBlock\VideoBlockPresentationView;
use SRAG\Learnplaces\gui\component\PlusView;
use SRAG\Learnplaces\gui\exception\ValidationException;
use SRAG\Learnplaces\gui\helper\CommonControllerAction;
use SRAG\Learnplaces\service\media\exception\FileUploadException;
use SRAG\Learnplaces\service\media\VideoService;
use SRAG\Learnplaces\service\publicapi\block\ConfigurationService;
use SRAG\Learnplaces\service\publicapi\block\LearnplaceService;
use SRAG\Learnplaces\service\publicapi\block\VideoBlockService;
use SRAG\Learnplaces\service\publicapi\model\VideoBlockModel;
use SRAG\Learnplaces\service\publicapi\model\VideoModel;

/**
 * Class xsrlVideoBlockGUI
 *
 * @package SRAG\Learnplaces\gui\block\VideoBlock
 *
 * @author  Nicolas Schäfli <ns@studer-raimann.ch>
 */
final class xsrlVideoBlockGUI {

	use InsertPositionAware;

	const TAB_ID = 'edit-block';
	const BLOCK_ID_QUERY_KEY = 'block';

	/**
	 * @var ilTabsGUI $tabs
	 */
	private $tabs;
	/**
	 * @var ilTemplate $template
	 */
	private $template;
	/**
	 * @var ilCtrl $controlFlow
	 */
	private $controlFlow;
	/**
	 * @var ilAccessHandler $access
	 */
	private $access;
	/**
	 * @var GlobalHttpState $http
	 */
	private $http;
	/**
	 * @var ilLearnplacesPlugin $plugin
	 */
	private $plugin;
	/**
	 * @var VideoBlockService $videoBlockService
	 */
	private $videoBlockService;
	/**
	 * @var VideoService $videoService
	 */
	private $videoService;
	/**
	 * @var LearnplaceService $learnplaceService
	 */
	private $learnplaceService;
	/**
	 * @var ConfigurationService $configService
	 */
	private $configService;


	/**
	 * xsrlVideoBlockGUI constructor.
	 *
	 * @param ilTabsGUI            $tabs
	 * @param ilTemplate           $template
	 * @param ilCtrl               $controlFlow
	 * @param ilAccessHandler      $access
	 * @param GlobalHttpState      $http
	 * @param ilLearnplacesPlugin  $plugin
	 * @param VideoBlockService    $videoBlockService
	 * @param VideoService         $videoService
	 * @param LearnplaceService    $learnplaceService
	 * @param ConfigurationService $configService
	 */
	public function __construct(ilTabsGUI $tabs, ilTemplate $template, ilCtrl $controlFlow, ilAccessHandler $access, GlobalHttpState $http, ilLearnplacesPlugin $plugin, VideoBlockService $videoBlockService, VideoService $videoService, LearnplaceService $learnplaceService, ConfigurationService $configService) {
		$this->tabs = $tabs;
		$this->template = $template;
		$this->controlFlow = $controlFlow;
		$this->access = $access;
		$this->http = $http;
		$this->plugin = $plugin;
		$this->videoBlockService = $videoBlockService;
		$this->videoService = $videoService;
		$this->learnplaceService = $learnplaceService;
		$this->configService = $configService;
	}


	public function executeCommand() {

		$this->template->getStandardTemplate();
		$cmd = $this->controlFlow->getCmd(CommonControllerAction::CMD_INDEX);
		$this->tabs->activateTab(self::TAB_ID);

		switch ($cmd) {
			case CommonControllerAction::CMD_ADD:
			case CommonControllerAction::CMD_CANCEL:
			case CommonControllerAction::CMD_CONFIRM:
			case CommonControllerAction::CMD_CREATE:
			case CommonControllerAction::CMD_DELETE:
			case CommonControllerAction::CMD_EDIT:
			case CommonControllerAction::CMD_UPDATE:
				if ($this->checkRequestReferenceId()) {
					$this->{$cmd}();
				}
				break;
		}
		$this->template->show();

		return true;
	}

	private function checkRequestReferenceId() {
		/**
		 * @var $ilAccess \ilAccessHandler
		 */
		$ref_id = $this->getCurrentRefId();
		if ($ref_id) {
			return $this->access->checkAccess('write', '', $ref_id);
		}

		return true;
	}

	private function getCurrentRefId(): int {
		return intval($this->http->request()->getQueryParams()['ref_id']);
	}

	private function add() {
		$this->controlFlow->saveParameter($this, PlusView::POSITION_QUERY_PARAM);

		$config = $this->configService->findByObjectId(ilObject::_lookupObjectId($this->getCurrentRefId()));
		$block = new VideoBlockModel();

		$block->setVisibility($config->getDefaultVisibility());
		$form = new VideoBlockEditFormView($block);
		$form->fillForm();
		$this->template->setContent($form->getHTML());
	}

	private function create() {
		$form = new VideoBlockEditFormView(new VideoBlockModel());
		try {
			//store block
			/**
			 * @var VideoBlockModel $block
			 */
			$block = $form->getBlockModel();
			$video = $this->videoService->storeUpload(ilObject::_lookupObjectId($this->getCurrentRefId()));
			$block
				->setPath($video->getCoverPath())
				->setPath($video->getVideoPath());

			$uploadBlock = $this->videoBlockService->store($block);

			//fetch learnplace
			$learnplace = $this->learnplaceService->findByObjectId(ilObject::_lookupObjectId($this->getCurrentRefId()));

			//store relation learnplace <-> block
			$blocks = $learnplace->getBlocks();
			array_splice($blocks, $this->getInsertPosition($this->http->request()), 0, [$uploadBlock]);
			$learnplace->setBlocks($blocks);
			$this->learnplaceService->store($learnplace);

			ilUtil::sendSuccess($this->plugin->txt('message_changes_save_success'), true);
			$this->controlFlow->redirectByClass(xsrlContentGUI::class, CommonControllerAction::CMD_INDEX);
		}
		catch (ValidationException $ex) {
			$form->setValuesByPost();
			$this->template->setContent($form->getHTML());
		}
		catch (LogicException $ex) {
			$form->setValuesByPost();
			$this->template->setContent($form->getHTML());
		}
		catch (FileUploadException $ex) {
			$form->setValuesByPost();
			ilUtil::sendFailure($this->plugin->txt('video_block_upload_error'));
			$this->template->setContent($form->getHTML());
		}
	}

	private function edit() {
		$blockId = $this->getBlockId();
		$block = $this->videoBlockService->find($blockId);
		$form = new VideoBlockEditFormView($block);
		$form->fillForm();
		$this->template->setContent($form->getHTML());
	}

	private function update() {
		$tempBlock = new VideoBlockModel();
		$tempBlock->setId(PHP_INT_MAX);
		$form = new VideoBlockEditFormView($tempBlock);

		try {
			/**
			 * @var VideoBlockModel $block
			 */
			$block = $form->getBlockModel();
			$oldVideoBlock = $this->videoBlockService->find($block->getId());
			$block
				->setPath($oldVideoBlock->getPath())
				->setCoverPath($oldVideoBlock->getCoverPath());

			$uploadedFiles = $this->http->request()->getUploadedFiles();
			if(count($uploadedFiles) === 1 && array_pop($uploadedFiles)->getError() === UPLOAD_ERR_OK) {

				//store new video
				$video = $this->videoService->storeUpload(ilObject::_lookupObjectId($this->getCurrentRefId()));
				$block
					->setPath($video->getVideoPath())
					->setCoverPath($video->getCoverPath());

				//delete old video
				$oldVideo = new VideoModel();
				$oldVideo
					->setVideoPath($oldVideoBlock->getPath())
					->setCoverPath($oldVideoBlock->getCoverPath());
				$this->videoService->delete($oldVideo);
			}

			$this->videoBlockService->store($block);

			ilUtil::sendSuccess($this->plugin->txt('message_changes_save_success'), true);
			$this->controlFlow->redirectByClass(xsrlContentGUI::class, CommonControllerAction::CMD_INDEX);
		}
		catch (ValidationException $ex) {
			$form->setValuesByPost();
			$this->template->setContent($form->getHTML());
		}
		catch (LogicException $ex) {
			$form->setValuesByPost();
			$this->template->setContent($form->getHTML());
		}
		catch (FileUploadException $ex) {
			$form->setValuesByPost();
			ilUtil::sendFailure($this->plugin->txt('video_block_upload_error'));
			$this->template->setContent($form->getHTML());
		}
	}

	private function delete() {
		$blockId = intval($this->http->request()->getQueryParams()[self::BLOCK_ID_QUERY_KEY]);
		$this->videoBlockService->delete($blockId);
		ilUtil::sendSuccess($this->plugin->txt('message_delete_success'), true);
		$this->controlFlow->redirectByClass(xsrlContentGUI::class, CommonControllerAction::CMD_INDEX);
	}

	private function confirm() {
		$confirm = new ilConfirmationGUI();
		$confirm->setHeaderText($this->plugin->txt('confirm_delete_header'));
		$confirm->setFormAction(
			$this->controlFlow->getFormAction($this) .
			'&' .
			self::BLOCK_ID_QUERY_KEY .
			'=' .
			$this->http->request()->getQueryParams()[self::BLOCK_ID_QUERY_KEY]
		);
		$confirm->setConfirm($this->plugin->txt('common_delete'), CommonControllerAction::CMD_DELETE);
		$confirm->setCancel($this->plugin->txt('common_cancel'), CommonControllerAction::CMD_CANCEL);
		$this->template->setContent($confirm->getHTML());
	}

	private function cancel() {
		$this->controlFlow->redirectByClass(xsrlContentGUI::class, CommonControllerAction::CMD_INDEX);
	}

	private function getBlockId(): int {
		return intval($this->http->request()->getQueryParams()[self::BLOCK_ID_QUERY_KEY]);
	}
}