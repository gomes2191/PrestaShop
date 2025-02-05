<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

declare(strict_types=1);

namespace Tests\Unit\Core\Form\IdentifiableObject\CommandBuilder\Product\Combination;

use PrestaShop\PrestaShop\Core\Domain\Product\Combination\Command\UpdateCombinationCommand;
use PrestaShop\PrestaShop\Core\Form\IdentifiableObject\CommandBuilder\Product\Combination\UpdateCombinationCommandsBuilder;

class UpdateCombinationCommandsBuilderTest extends AbstractCombinationCommandBuilderTest
{
    /**
     * @dataProvider getExpectedCommands
     *
     * @param array $formData
     * @param array $expectedCommands
     */
    public function testBuildCommand(array $formData, array $expectedCommands)
    {
        $builder = new UpdateCombinationCommandsBuilder();
        $builtCommands = $builder->buildCommands($this->getCombinationId(), $formData);
        $this->assertEquals($expectedCommands, $builtCommands);
    }

    public function getExpectedCommands(): iterable
    {
        yield [
            [
                'no data' => ['useless value'],
            ],
            [],
        ];

        yield [
            [
                'price_impact' => [
                    'not_handled' => 0,
                ],
                'references' => [
                    'not_handled' => 0,
                ],
            ],
            [],
        ];

        $command = new UpdateCombinationCommand($this->getCombinationId()->getValue());
        $command->setWeight('12.00');
        $command->setReference('toto');
        yield [
            [
                'price_impact' => [
                    'not_handled' => 0,
                    'weight' => 12.0,
                ],
                'references' => [
                    'reference' => 'toto',
                ],
            ],
            [$command],
        ];

        $command = new UpdateCombinationCommand($this->getCombinationId()->getValue());
        $command->setWeight('12.00');
        yield [
            [
                'price_impact' => [
                    'not_handled' => 0,
                    'weight' => 12.0,
                ],
            ],
            [$command],
        ];

        $command = new UpdateCombinationCommand($this->getCombinationId()->getValue());
        $command->setUpc('123456');
        $command->setMpn('mpn');
        yield [
            [
                'references' => [
                    'upc' => '123456',
                    'mpn' => 'mpn',
                ],
            ],
            [$command],
        ];

        $command = new UpdateCombinationCommand($this->getCombinationId()->getValue());
        $command->setIsbn('0-8044-2957-X');
        $command->setEan13('12345678910');
        yield [
            [
                'references' => [
                    'isbn' => '0-8044-2957-X',
                    'ean_13' => '12345678910',
                ],
            ],
            [$command],
        ];
    }
}
