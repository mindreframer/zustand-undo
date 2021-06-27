import { expect } from '@jest/globals'
import create from 'zustand'
import { undoMiddleware, UndoState } from '../src/index'

interface StoreState extends UndoState {
  bears: number
  increasePopulation: () => void
  removeAllBears: () => void
}

const useStoreWithUndo = create<StoreState>(
  undoMiddleware(set => ({
    bears: 0,
    increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
  }))
)

describe('Basic test for undo / redo', () => {
  it('works', () => {
    useStoreWithUndo.getState().increasePopulation()
    useStoreWithUndo.getState().increasePopulation()
    expect(useStoreWithUndo.getState().bears).toBe(2)

    useStoreWithUndo.getState().undo()
    expect(useStoreWithUndo.getState().bears).toBe(1)
    useStoreWithUndo.getState().redo()
    expect(useStoreWithUndo.getState().bears).toBe(2)

    useStoreWithUndo.getState().clear()
    expect(useStoreWithUndo.getState().bears).toBe(2)
  })
})
