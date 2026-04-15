import Foundation

struct RecommendedTrack: Identifiable, Hashable {
    let id: String
    let title: String
    let artistName: String
    let previewURL: URL?
}
