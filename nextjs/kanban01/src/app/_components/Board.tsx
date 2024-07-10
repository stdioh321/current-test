import React from 'react'
import { faker } from '@faker-js/faker';
import { UncontrolledBoard } from '@caldwell619/react-kanban';

export default function Board({ initialBoard }: { initialBoard?: { columns: { id: bigint, title: string, cards: { id: bigint, title: string, description: string }[] }[] } } = {}) {
    const board: { columns: { id: bigint, title: string, cards: { id: bigint, title: string, description: string }[] }[] } = initialBoard || {
        columns: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => ({
            id: faker.string.uuid(),
            title: faker.lorem.words(),
            cards: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => ({
                id: faker.string.uuid(),
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph()
            }))
        }))
    }

    const onCardNew = (newCard: any) => {
        let c = { ...newCard, id: faker.string.uuid() }
        return c
    }


    return (
        <UncontrolledBoard initialBoard={board as any} allowAddCard onNewCardConfirm={onCardNew} onCardNew={console.log} />
    )

}
