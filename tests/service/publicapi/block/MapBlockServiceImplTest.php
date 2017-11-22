<?php
declare(strict_types=1);

namespace SRAG\Learnplaces\service\publicapi\block;

use InvalidArgumentException;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\TestCase;
use SRAG\Learnplaces\persistence\repository\exception\EntityNotFoundException;
use SRAG\Learnplaces\persistence\repository\MapBlockRepository;
use SRAG\Learnplaces\service\publicapi\model\MapBlockModel;

/**
 * Class MapBlockServiceImplTest
 *
 * @package SRAG\Learnplaces\service\publicapi\block
 *
 * @author  Nicolas Schäfli <ns@studer-raimann.ch>
 */
class MapBlockServiceImplTest extends TestCase {

	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var MapBlockRepository|MockInterface $mapBlockRepositoryMock
	 */
	private $mapBlockRepositoryMock;
	/**
	 * @var MapBlockServiceImpl $subject
	 */
	private $subject;

	/**
	 * @inheritDoc
	 */
	protected function setUp() {
		parent::setUp();

		
		$this->mapBlockRepositoryMock = Mockery::mock(MapBlockRepository::class);
		$this->subject = new MapBlockServiceImpl($this->mapBlockRepositoryMock);
	}

	/**
	 * @Test
	 */
	public function testStoreWhichShouldSucceed() {
		$model = new MapBlockModel();
		$model->setId(6)
			->setSequence(15)
			->setVisibility("ALWAYS");

		$this->mapBlockRepositoryMock
			->shouldReceive('store')
			->once()
			->with(Mockery::any())
			->andReturn($model->toDto());

		$this->subject->store($model);
	}

	/**
	 * @Test
	 */
	public function testDeleteWhichShouldSucceed() {
		$model = new MapBlockModel();
		$model->setId(6)
			->setSequence(15)
			->setVisibility("ALWAYS");

		$this->mapBlockRepositoryMock
			->shouldReceive('delete')
			->once()
			->with($model->getId())
			->andReturn($model->toDto());

		$this->subject->delete($model->getId());
	}

	/**
	 * @Test
	 */
	public function testDeleteWithInvalidIdWhichShouldFail() {
		$blockId = 6;

		$this->mapBlockRepositoryMock
			->shouldReceive('delete')
			->once()
			->with($blockId)
			->andThrow(new EntityNotFoundException('Entity not found'));

		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessage('The map block with the given id could not be deleted, because the block was not found.');

		$this->subject->delete($blockId);

	}


	/**
	 * @Test
	 */
	public function testFindWhichShouldSucceed() {
		$model = new MapBlockModel();
		$model->setId(6)
			->setSequence(15)
			->setVisibility("ALWAYS");

		$this->mapBlockRepositoryMock
			->shouldReceive('findByBlockId')
			->once()
			->with($model->getId())
			->andReturn($model->toDto());

		$this->subject->find($model->getId());
	}

	/**
	 * @Test
	 */
	public function testFindWithInvalidIdWhichShouldFail() {
		$blockId = 6;

		$this->mapBlockRepositoryMock
			->shouldReceive('findByBlockId')
			->once()
			->with($blockId)
			->andThrow(new EntityNotFoundException('Entity not found'));

		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessage('The map block with the given id does not exist.');

		$this->subject->find($blockId);

	}
}
